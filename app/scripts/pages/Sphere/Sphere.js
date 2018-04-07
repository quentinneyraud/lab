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
  radius: 40,
  scale: 0,
  x: 0,
  vertices: 400
}

export default class Sphere {
  constructor (THREEp, options = {}) {
    THREE = THREEp
    this.options = Object.assign({}, DEFAULT_OPTIONS, options)
    this.startTime = Date.now()

    this.getElements()

    this.createScene()
    this.createMaterial()
    this.createRenderer()
    this.addCamera()
    this.addMesh()

    this.loopBinded = this.loop.bind(this)
    window.addEventListener('resize', this.onResize.bind(this))
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

  addMesh () {
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(this.options.radius, this.options.vertices, this.options.vertices),
      this.material)
    this.sphere.position.z = -200
    this.sphere.rotation.x = -1

    this.scene.add(this.sphere)
  }

  loop () {
    this.update()
    this.render()
  }

  start () {
    TweenLite.ticker.addEventListener('tick', this.loopBinded)

    TweenMax.fromTo(this.sphere.scale, 5, {
      x: 0,
      y: 0,
      z: 0
    }, {
      x: 1,
      y: 1,
      z: 1
    })
  }

  stop () {
    TweenLite.ticker.removeEventListener('tick', this.loopBinded)
  }

  onResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  update () {
    this.material.uniforms['time'].value = 0.0001 * (Date.now() - this.startTime)
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }
}
