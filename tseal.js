class Test {
  constructor(name) {
    this.name = name
    //Object.seal(this)
  }

  x(s) {
    this.name += s
  }

  y() {
    console.log('y')
  }
}

let t = new Test('Bob')

t.x('x')
console.log(t.name)
t.y()

t.y = () => {
  console.log('changed y')
}

Test.y = () => {
  console.log('changed y 2')
}

t1 = new Test('Ed')
t1.y()

