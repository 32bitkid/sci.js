export interface FragShaderSourceOptions {
  maxHBlur?: number;
}

export const fragShaderSource = ({
  maxHBlur = 10,
}: FragShaderSourceOptions = {}) => `
  #define MAX_H_BLUR_SIZE ${maxHBlur.toFixed(1)}
  #define PI 3.141592653589793115997963468544185161590576171875
  #define TAU 6.28318530717958623199592693708837032318115234375

  precision highp float;

  uniform vec3 u_Lens;
  uniform sampler2D uSampler;
  uniform vec2 u_resolution;
  uniform vec2 u_textureSize;
  uniform vec2 u_monitorRes;
  uniform float u_hBlurSize;
  uniform float u_grainAmount;
  uniform float u_vignetteAmount;
  uniform bool u_scanLines;
  varying vec3 vPosition;
  varying mediump vec2 vTextureCoord;
  
  mediump vec2 getMapping(vec2 c) {
    return c * vec2(1.0, -1.0) / 2.0 + vec2(0.5, 0.5);
  }
  
  float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  float luma(vec3 color) {
    return dot(color, vec3(0.2989, 0.5866, 0.1145));
  }
  
  mediump vec3 vignette(
    mediump vec3 texture, 
    vec3 color,
    float radius, 
    float smoothness,
    float intensity
  ) {
      float dim = max(u_resolution.x, u_resolution.y);
      vec2 pos = gl_FragCoord.xy / max(u_resolution.x, u_resolution.y);
      vec2 center = vec2(u_resolution) / dim * 0.5;
      
      float diff = radius - distance(pos , center)  / u_Lens.z;
      float l = luma(texture);
      float d = clamp(smoothstep(-smoothness, smoothness, diff), 0.0, 1.0);
      return mix(color, texture, d);
  } 
  
  void main(void){
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
    mediump vec4 texture = vec4(0.0);
    mediump vec2 vMapping = vPosition.xy;
      
    // Barrel Distortion
    {
      vMapping += ((vPosition.yx * vPosition.yx) / u_Lens.z) * (vPosition.xy / u_Lens.z) * (u_Lens.xy * -1.0);
      vMapping = getMapping(vMapping / u_Lens.z);
      texture = texture2D(uSampler, vMapping);
    }
    
    // H-Box Blur 
    {
      if (u_hBlurSize > 0.0) {

        mediump vec3 sum = texture.rgb;
        for (float i = 0.0; i < MAX_H_BLUR_SIZE; i+=1.0) {
          if (i >= u_hBlurSize) break; 
          sum += texture2D(uSampler, vMapping + onePixel * vec2(-1.0 * (i + 1.0), 0.0)).rgb;
          sum += texture2D(uSampler, vMapping + onePixel * vec2(1.0 * (i + 1.0), 0.0)).rgb;
        }
        texture.rgb = sum / (min(MAX_H_BLUR_SIZE, u_hBlurSize) * 2.0 + 1.0);
      }      
    }
    
    // Scanlines
    {
      if (u_scanLines) {
        float vScan = smoothstep(1080.0 / 4.0 / u_Lens.z, 1440.0 / u_Lens.z, u_resolution.y) * 0.20;
        texture.rgb *= 1.0 - clamp(
          pow((1.0 - cos(vMapping.y * TAU * u_monitorRes.y + PI)) / 2.0, 5.0) * vScan,
          0.0, 1.0
        );
        
        float rgbMaskInt = 0.10;
        float hScan = smoothstep(1080.0 / 4.0 / u_Lens.z, 1440.0 / u_Lens.z, u_resolution.y) * 0.05;
        float odd = mod(floor(vMapping.y * u_monitorRes.y), 2.0) * PI;
        texture.rgb *= 1.0 - clamp(
          ((cos(vMapping.x * TAU * u_monitorRes.x + odd) - 1.0) / 2.0) * hScan, 
          -1.0, 0.0
        );
      }
    }

    // Vignette    
    {
      if (u_vignetteAmount > 0.0) {
        texture.rgb = vignette(texture.rgb, vec3(-0.05), 0.85, 0.55, 1.0 * u_vignetteAmount);
        texture.rgb = vignette(texture.rgb, vec3(0.05), 0.66, 0.145, 0.2 * u_vignetteAmount);
      }
    }
    
    // Grain
    {
      if (u_grainAmount > 0.0) { 
        float l = luma(texture.rgb);
        float diff = ((rand(gl_FragCoord.xy) - 0.5) * u_grainAmount * (1.0 - l));
        texture.rgb += diff;
      }
    }

    // Clipping    
    if(
      vMapping.x > 1.0 || vMapping.x < 0.0 || 
      vMapping.y > 1.0 || vMapping.y < 0.0
    ) {
      vec2 oob = 1.5 - (abs(vMapping - 0.5) - 0.5) / (vec2(1.0, 1.0) / u_resolution);
      float a = clamp(min(oob.x, oob.y), 0.0, 1.0);
      texture = mix(vec4(0.0),texture,  a);
    } 
    
    // Glare
    {
      // TODO
    }  
      
    gl_FragColor = texture;
  }
`;
