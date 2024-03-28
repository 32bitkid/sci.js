export const vertexShaderSource = `
  precision highp float;
  
  attribute vec3 aVertexPosition;
  varying vec3 vPosition;
  
  attribute mediump vec2 aTextureCoord;
  varying mediump vec2 vTextureCoord;
  
  void main(void){
    vPosition = aVertexPosition;
    vTextureCoord = aTextureCoord;
    gl_Position = vec4(vPosition, 1.0);
  }
`;
