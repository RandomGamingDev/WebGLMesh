let Mesh = {};

Mesh.VAO = class {
  constructor(gl) {
    this.gl = gl;
    this.id = gl.createVertexArray();
  }
  
  enable() {
    this.gl.enableVertexAttribArray(this.id);
  }
  
  disable() {
    this.gl.disableVertexAttribArray(this.id);
  }
  
  link_attrib(index, size, type, normalized, stride, offset) {
    this.gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
  }
  
  bind() {
    this.gl.bindVertexArray(this.id);
  }
  
  unbind() {
    this.gl.bindVertexArray(null);
  }
}

Mesh.VBO = class {
  constructor(vertices, how_use, gl) {
    this.gl = gl;
    this.vertices = vertices;
    this.how_use = how_use;
    this.id = gl.createBuffer();
    this.bind();
    this.data(vertices, how_use);
  }
  
  bind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.id);
  }
  
  unbind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  data(vertices, how_use) {
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, how_use);
  }
  
  subdata(offset, vertices) {
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, offset, vertices);
  }
  
  get_subdata(src_offset, dst, dst_offset, length) {
    this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, src_offset, dst, dst_offset, length);
  }
  
  delete() {
    this.gl.deleteBuffer(this.id);
  }
}

Mesh.EBO = class {
  constructor(indices, how_use, gl) {
    this.gl = gl;
    this.indices = indices;
    this.how_use = how_use;
    this.id = gl.createBuffer();
    this.bind();
    this.data(indices, how_use);
  }
  
  bind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.id);
  }

  unbind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
  }
  
  data(indices, how_use) {
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, how_use);
  }
  
  subdata(offset, indices) {
    this.gl.bufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, offset, indices);
  }
  
  get_subdata(src_offset, dst, dst_offset, length) {
    this.gl.getBufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, src_offset, dst, dst_offset, length);
  }
  
  delete() {
    this.gl.deleteBuffer(this.id);
  }
}