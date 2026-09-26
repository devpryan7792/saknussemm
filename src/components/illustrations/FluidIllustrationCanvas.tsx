import React, { useEffect, useRef, useState } from 'react';

interface FluidIllustrationCanvasProps {
  src: string;
  alt: string;
  checkpointId: number;
  className?: string;
  glowColor?: string;
}

const VERTEX_SHADER_SRC = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = (a_position + 1.0) * 0.5;
    v_uv.y = 1.0 - v_uv.y; // Flip Y for WebGL texture coords
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision mediump float;
  varying vec2 v_uv;

  uniform sampler2D u_image;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_mouse_intensity;
  uniform float u_hover;
  uniform int u_checkpoint_id;
  uniform vec3 u_glow_color;

  void main() {
    vec2 uv = v_uv;

    // Aspect ratio correction for ripple calculation
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 aspectUv = vec2(uv.x * aspect, uv.y);
    vec2 aspectMouse = vec2(u_mouse.x * aspect, u_mouse.y);

    // 1. Mouse Interaction Ripples
    float dist = distance(aspectUv, aspectMouse);
    float mouseWave = sin(dist * 28.0 - u_time * 6.5) * exp(-dist * 6.0);
    vec2 mouseDir = (dist > 0.001) ? normalize(aspectUv - aspectMouse) : vec2(0.0);
    vec2 mouseOffset = mouseDir * mouseWave * (0.015 * u_mouse_intensity + 0.008 * u_hover);

    // 2. Biome-Specific Organic Fluid Waves
    vec2 ambientOffset = vec2(0.0);

    if (u_checkpoint_id == 5 || u_checkpoint_id == 6) {
      // Subterranean ocean / Leviathan battle: Liquid fluid swell
      float wave1 = sin(uv.y * 14.0 + u_time * 1.8) * cos(uv.x * 10.0 + u_time * 1.4);
      float wave2 = cos(uv.y * 22.0 - u_time * 2.2 + uv.x * 8.0);
      ambientOffset = vec2(wave1 * 0.008, wave2 * 0.006);
    } else if (u_checkpoint_id == 7) {
      // Stromboli Volcanic ascent: Rising heat haze convection ripples
      float heat = sin(uv.y * 30.0 - u_time * 4.5) * (1.0 - uv.y);
      float shimmer = cos(uv.x * 24.0 + u_time * 3.2);
      ambientOffset = vec2(shimmer * 0.006, heat * 0.012);
    } else if (u_checkpoint_id == 4) {
      // Sea of Mushrooms: Phosphorescent spore pulse
      float pulse = sin(dist * 12.0 - u_time * 2.0) * exp(-dist * 3.0);
      ambientOffset = vec2(pulse * 0.005, pulse * 0.005);
    } else if (u_checkpoint_id == 3) {
      // Whispering Gallery: Acoustic resonant vibration
      float acoustic = sin(uv.y * 45.0 + u_time * 5.0) * 0.003;
      ambientOffset = vec2(acoustic, acoustic * 0.5);
    } else {
      // Default: Subtle antique parchment breathing
      float breath = sin(u_time * 0.8 + uv.x * 3.0) * cos(u_time * 0.6 + uv.y * 3.0);
      ambientOffset = vec2(breath * 0.002, breath * 0.002);
    }

    vec2 totalDisplacement = mouseOffset + ambientOffset;
    float dispMag = length(totalDisplacement);

    // 3. Chromatic Aberration along ripple crests
    float aberration = 0.012 + dispMag * 1.8;
    vec2 uvR = clamp(uv + totalDisplacement * (1.0 + aberration), 0.0, 1.0);
    vec2 uvG = clamp(uv + totalDisplacement, 0.0, 1.0);
    vec2 uvB = clamp(uv + totalDisplacement * (1.0 - aberration), 0.0, 1.0);

    float r = texture2D(u_image, uvR).r;
    float g = texture2D(u_image, uvG).g;
    float b = texture2D(u_image, uvB).b;

    // 4. Highlight Crest Specular Sheen
    float crest = max(0.0, dot(totalDisplacement * 40.0, vec2(1.0, -1.0)));
    vec3 color = vec3(r, g, b);
    color += u_glow_color * (crest * 0.35 + dispMag * 1.2);

    // 5. Soft Antique Vignette Edge
    vec2 d = abs(uv - 0.5) * 2.0;
    float vignette = 1.0 - smoothstep(0.75, 1.0, length(d));
    color *= mix(0.7, 1.0, vignette);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function FluidIllustrationCanvas({
  src,
  alt,
  checkpointId,
  className = '',
  glowColor = '#c9a84c',
}: FluidIllustrationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [glReady, setGlReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const mouseStateRef = useRef({
    x: 0.5,
    y: 0.5,
    tx: 0.5,
    ty: 0.5,
    intensity: 0.0,
    targetIntensity: 0.0,
    hover: 0.0,
    targetHover: 0.0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext('webgl', { alpha: false, antialias: true, premultipliedAlpha: false }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) {
      setLoadError(true);
      return;
    }

    // Compile Shaders
    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error('Shader compile error:', glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vertShader || !fragShader) {
      setLoadError(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setLoadError(true);
      return;
    }

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      setLoadError(true);
      return;
    }

    gl.useProgram(program);

    // Quad geometry (-1..1)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uMouseIntensity = gl.getUniformLocation(program, 'u_mouse_intensity');
    const uHover = gl.getUniformLocation(program, 'u_hover');
    const uCheckpointId = gl.getUniformLocation(program, 'u_checkpoint_id');
    const uGlowColor = gl.getUniformLocation(program, 'u_glow_color');

    // Parse glow color to RGB 0..1
    const parseRgb = (hex: string) => {
      const clean = hex.replace('#', '');
      const num = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
      return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
    };
    const [gr, gg, gb] = parseRgb(glowColor);

    // Create texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Placeholder 1x1 dark pixel while image loads
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([20, 16, 12, 255])
    );

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!gl || gl.isContextLost()) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      setGlReady(true);
    };
    img.onerror = () => {
      setLoadError(true);
    };
    img.src = src;

    let animId: number;
    let startTime = performance.now();
    let isMounted = true;
    let isVisibleOnScreen = true;

    // Visibility Observer to pause rendering completely when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleOnScreen = entry.isIntersecting;
        if (isVisibleOnScreen && !animId) {
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let lastFrameTime = performance.now();

    const render = () => {
      if (!isMounted || !gl || gl.isContextLost()) return;
      if (!isVisibleOnScreen) {
        animId = 0;
        return;
      }

      const now = performance.now();
      const elapsed = (now - startTime) * 0.001;

      // Smooth mouse lerping
      const ms = mouseStateRef.current;
      ms.x += (ms.tx - ms.x) * 0.12;
      ms.y += (ms.ty - ms.y) * 0.12;
      ms.intensity += (ms.targetIntensity - ms.intensity) * 0.08;
      ms.hover += (ms.targetHover - ms.hover) * 0.08;
      ms.targetIntensity *= 0.94; // Decay

      // Idle power saving: if idle and no hover, cap at 30fps to preserve battery
      const isIdle = ms.hover < 0.02 && ms.intensity < 0.01;
      if (isIdle && now - lastFrameTime < 32) {
        animId = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = now;

      // Resize canvas to client display size with DPI clamp (1.5 max for performance)
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const displayWidth = Math.round(canvas.clientWidth * dpr);
      const displayHeight = Math.round(canvas.clientHeight * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }

      gl.useProgram(program);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, ms.x, ms.y);
      gl.uniform1f(uMouseIntensity, ms.intensity);
      gl.uniform1f(uHover, ms.hover);
      gl.uniform1i(uCheckpointId, checkpointId);
      gl.uniform3f(uGlowColor, gr, gg, gb);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      if (gl && !gl.isContextLost()) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteTexture(texture);
        gl.deleteProgram(program);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
      }
    };
  }, [src, checkpointId, glowColor]);

  const updateCoordinates = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    const ms = mouseStateRef.current;
    const dx = nx - ms.tx;
    const dy = ny - ms.ty;
    const distDelta = Math.sqrt(dx * dx + dy * dy);

    ms.tx = nx;
    ms.ty = ny;
    ms.targetIntensity = Math.min(1.0, ms.targetIntensity + distDelta * 4.5);
    ms.targetHover = 1.0;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    updateCoordinates(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    mouseStateRef.current.targetHover = 1.0;
    if (e.touches.length > 0) {
      updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMouseEnter = () => {
    mouseStateRef.current.targetHover = 1.0;
  };

  const handleMouseLeave = () => {
    mouseStateRef.current.targetHover = 0.0;
    mouseStateRef.current.targetIntensity = 0.0;
  };

  if (loadError) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${className} checkpoint-illustration transition-transform duration-700`}
        loading="lazy"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      className={`${className} checkpoint-illustration cursor-pointer block select-none`}
      style={{
        opacity: glReady ? 1 : 0.4,
        transition: 'opacity 0.4s ease',
      }}
    />
  );
}
