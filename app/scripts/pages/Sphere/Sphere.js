import { selectId } from '../../utils/index'

let THREE = null

const VIEW_ANGLE = 45
const NEAR = 0.1
const FAR = 10000

const DEFAULT_OPTIONS = {
  sceneWidth: window.innerWidth,
  sceneHeight: window.innerHeight,
  containerId: 'sphere',
  vertexShaderId: 'vertexShader',
  fragmentShaderId: 'fragmentShader',
  radius: 0,
  scale: 0,
  x: 0,
  vertices: 400
}

export default class Sphere {
  constructor (THREEp, options = {}) {
    THREE = THREEp
    this.options = Object.assign({}, DEFAULT_OPTIONS, options)
    this.start = Date.now()

    this.getElements()

    this.createScene()
    this.createMaterial()
    this.createRenderer()
    this.addCamera()
    this.addLight()
    this.addMesh()
  }

  getElements () {
    this.$els = {
      container: selectId(this.options.containerId),
      fragmentShader: selectId(this.options.fragmentShaderId),
      vertexShader: selectId(this.options.vertexShaderId)
    }
  }

  createScene () {
    this.scene = new THREE.Scene()
  }

  createRenderer () {
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(this.options.sceneWidth, this.options.sceneHeight)
    // this.renderer.setClearColorHex(0xffffff, 0)
    this.$els.container.appendChild(this.renderer.domElement)
  }

  createMaterial () {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0.0
        }
      },
      vertexShader: this.$els.vertexShader.textContent,
      fragmentShader: this.$els.fragmentShader.textContent
    })
  }

  addCamera () {
    this.camera = new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      this.options.sceneWidth / this.options.sceneHeight,
      NEAR,
      FAR
    )

    this.scene.add(this.camera)
  }

  addLight () {
    const pointLight =
      new THREE.PointLight(0xFFFFFF)

    pointLight.position.x = 10
    pointLight.position.y = 50
    pointLight.position.z = 130

    this.scene.add(pointLight)
  }

  addMesh () {
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(this.options.radius, this.options.vertices, this.options.vertices),
      this.material)
    this.sphere.position.z = -200
    this.sphere.rotation.x = -1

    this.scene.add(this.sphere)
  }

  update () {
    this.material.uniforms['time'].value = 0.0001 * (Date.now() - this.start)
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }
}
