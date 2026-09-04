"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;

#define TAU 6.28318530718

mat2 rotate2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float hash21(vec2 point) {
  point = fract(point * vec2(123.34, 456.21));
  point += dot(point, point + 45.32);
  return fract(point.x * point.y);
}

float noise2d(vec2 point) {
  vec2 cell = floor(point);
  vec2 local = fract(point);
  local = local * local * (3.0 - 2.0 * local);
  float a = hash21(cell);
  float b = hash21(cell + vec2(1.0, 0.0));
  float c = hash21(cell + vec2(0.0, 1.0));
  float d = hash21(cell + vec2(1.0, 1.0));
  return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
}

float waterHeight(vec2 point, float time) {
  vec2 drift = vec2(noise2d(point * 0.42 + time * 0.025), noise2d(point * 0.38 - time * 0.021));
  point += (drift - 0.5) * 0.82;
  float height = 0.0;
  height += sin(dot(point, normalize(vec2(1.0, 0.32))) * 3.15 + time * 0.52) * 0.36;
  height += sin(dot(point, normalize(vec2(-0.28, 1.0))) * 4.72 - time * 0.39) * 0.23;
  height += sin(dot(point, normalize(vec2(0.71, -0.58))) * 7.35 + time * 0.28) * 0.12;
  height += sin(dot(point, normalize(vec2(-0.82, -0.21))) * 11.4 - time * 0.19) * 0.055;
  vec2 pointerPoint = (u_pointer - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0) * 1.42;
  float pointerDistance = length(point - pointerPoint);
  height += sin(pointerDistance * 17.0 - time * 1.08) * exp(-pointerDistance * 3.6) * 0.075;
  return height;
}

vec2 triangleCentroid(vec2 point) {
  const float density = 13.0;
  vec2 rotated = rotate2d(-0.16) * point * density;
  vec2 cell = floor(rotated);
  vec2 local = fract(rotated);
  vec2 center = local.x + local.y < 1.0 ? cell + vec2(0.3333) : cell + vec2(0.6667);
  return rotate2d(0.16) * center / density;
}

float causticField(vec2 point, float time) {
  vec2 p = mod(point * TAU, TAU) - 250.0;
  vec2 warped = p;
  float field = 1.0;
  float intensity = 0.012;
  for (int index = 0; index < 5; index++) {
    float iteration = float(index) + 1.0;
    float phase = time * (0.23 - 0.012 / iteration);
    warped = p + vec2(
      cos(phase - warped.x) + sin(phase + warped.y),
      sin(phase - warped.y) + cos(phase + warped.x)
    );
    vec2 denominator = vec2(
      p.x / (sin(warped.x + phase) / intensity),
      p.y / (cos(warped.y + phase) / intensity)
    );
    field += 1.0 / max(length(denominator), 0.001);
  }
  field /= 5.0;
  field = 1.18 - pow(field, 1.32);
  return pow(clamp(field, 0.0, 1.0), 4.6);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 centered = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
  float time = u_time;

  vec2 surfacePoint = centered * 1.42;
  vec2 facetedPoint = triangleCentroid(surfacePoint);
  float sampleSize = 0.0065;
  float height = waterHeight(surfacePoint, time);
  float smoothSlopeX = waterHeight(surfacePoint + vec2(sampleSize, 0.0), time) - waterHeight(surfacePoint - vec2(sampleSize, 0.0), time);
  float smoothSlopeY = waterHeight(surfacePoint + vec2(0.0, sampleSize), time) - waterHeight(surfacePoint - vec2(0.0, sampleSize), time);
  float facetSample = 0.024;
  float facetSlopeX = waterHeight(facetedPoint + vec2(facetSample, 0.0), time) - waterHeight(facetedPoint - vec2(facetSample, 0.0), time);
  float facetSlopeY = waterHeight(facetedPoint + vec2(0.0, facetSample), time) - waterHeight(facetedPoint - vec2(0.0, facetSample), time);
  vec3 smoothNormal = normalize(vec3(-smoothSlopeX * 13.0, -smoothSlopeY * 13.0, 1.0));
  vec3 facetNormal = normalize(vec3(-facetSlopeX * 4.2, -facetSlopeY * 4.2, 1.0));
  vec3 normal = normalize(mix(smoothNormal, facetNormal, 0.72));

  vec2 refractedUv = uv + normal.xy * 0.047 + vec2(height * 0.004, -height * 0.003);
  float depth = clamp(0.18 + refractedUv.y * 0.68 + length(centered) * 0.16, 0.0, 1.0);
  vec3 ice = vec3(0.714, 0.933, 1.0);
  vec3 cyan = vec3(0.169, 0.792, 1.0);
  vec3 blue = vec3(0.0, 0.553, 0.914);
  vec3 deep = vec3(0.145, 0.42, 0.525);
  vec3 color = mix(ice, cyan, smoothstep(0.08, 0.58, depth));
  color = mix(color, mix(blue, deep, 0.36), smoothstep(0.48, 1.02, depth));

  vec3 lightDirection = normalize(vec3(-0.44, 0.28, 0.86));
  vec3 viewDirection = normalize(vec3(-centered * 0.18, 1.0));
  float diffuse = max(dot(normal, lightDirection), 0.0);
  float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 3.6);
  float specular = pow(max(dot(reflect(-lightDirection, normal), viewDirection), 0.0), 88.0);
  float caustics = causticField(refractedUv * vec2(1.26, 0.88) + normal.xy * 0.2, time);
  float fineCaustics = causticField(rotate2d(0.37) * refractedUv * 1.82 - normal.xy * 0.11, time * 0.81 + 3.7);
  caustics = mix(caustics, fineCaustics, 0.28) * smoothstep(1.02, 0.16, depth);

  vec2 sunPosition = vec2(0.28, 0.78);
  float sunBloom = exp(-8.5 * length(refractedUv - sunPosition));
  float centerCalm = 1.0 - smoothstep(0.05, 0.58, length(centered * vec2(0.78, 1.0)));
  float facetLight = smoothstep(-0.36, 0.72, dot(facetNormal.xy, normalize(vec2(-0.58, 0.82))));
  color += (facetLight - 0.5) * vec3(0.075, 0.13, 0.15);
  color += vec3(0.82, 0.96, 1.0) * caustics * 0.48;
  color += vec3(0.88, 0.97, 1.0) * specular * 0.72;
  color += vec3(0.68, 0.91, 1.0) * sunBloom * 0.16;
  color += vec3(0.95, 0.98, 0.94) * centerCalm * 0.16;
  color *= 0.84 + diffuse * 0.22;
  color = mix(color, deep, fresnel * 0.16);

  float edge = smoothstep(0.92, 0.28, length(centered * vec2(0.86, 1.0)));
  color *= 0.87 + edge * 0.13;
  float grain = hash21(gl_FragCoord.xy + floor(time * 12.0)) - 0.5;
  color += grain * 0.008;

  gl_FragColor = vec4(color, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function WaterHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      canvas.dataset.fallback = "true";
      return;
    }

    const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) {
      canvas.dataset.fallback = "true";
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.dataset.fallback = "true";
      return;
    }

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const pointerLocation = gl.getUniformLocation(program, "u_pointer");
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    let frame = 0;
    let visible = true;
    let lastFrame = 0;
    let pointerX = 0.5;
    let pointerY = 0.56;
    let targetPointerX = pointerX;
    let targetPointerY = pointerY;
    const startedAt = performance.now();

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
      const height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const draw = (now: number) => {
      frame = 0;
      if (!visible || document.hidden) return;
      if (!reducedMotion && now - lastFrame < 1000 / 40) {
        frame = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;
      resize();
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, reducedMotion ? 7.25 : (now - startedAt) / 1000);
      pointerX += (targetPointerX - pointerX) * 0.045;
      pointerY += (targetPointerY - pointerY) * 0.045;
      gl.uniform2f(pointerLocation, pointerX, pointerY);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      canvas.dataset.ready = "true";
      if (!reducedMotion) frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { threshold: 0.02 });
    const onVisibilityChange = () => {
      if (document.hidden && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else start();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion || !visible) return;
      const bounds = canvas.getBoundingClientRect();
      if (event.clientY < bounds.top || event.clientY > bounds.bottom) return;
      targetPointerX = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      targetPointerY = Math.max(0, Math.min(1, 1 - (event.clientY - bounds.top) / bounds.height));
    };

    observer.observe(canvas);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", start, { passive: true });
    start();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", start);
      if (frame) cancelAnimationFrame(frame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-water-canvas" aria-hidden="true" />;
}
