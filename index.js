// console.log("hello",2+3)

// "hello" String
// 10 Number
// 10.2 Number
// null
// undefined
// true/false Boolean

// let a=true;
// console.log(a)

// console.log(typeof a)

// let a=true;
// a=9
// console.log(a)

// var a=[]
// console.log(typeof a)

// a={name:"disha"}
// console.log(a)
// console.log(typeof a)

// console.log(true && false)
// true || false
// !true

// var a=20
// let age=60
// const pi=3.14

// console.log(typeof pi)

//const - can't reassign & redeclare
// pi=9
// console.log(typeof pi)

//var - reassign and re-declare
//re assigning
// var a=10
// a=20

// var a=10
// var a="h"

// console.log(a)

//let - reassign but not re-declared

// let a=10
// a=20
// console.log(a)


// let a=10
// let a=20
// console.log(a)

//scoping 
//var - accessed anywhere(functional scope)
//let - accessed only in a specific block (block)

// var a=10
// {
//     console.log(a)
//     var a=20
//     console.log(a)
// }
// console.log(a)


// let a=20
// {
//     let a=10
//     console.log(a)
// }
// console.log(a)

// console.log(a)
// var a

// console.log(a)
// let a

//lexical scoping
// let a=1
// if(true){
//     console.log(a)
//     let a=2
// }

// console.log(a)

// var a=10
// let b=20
// if(true){
//     var a=30
//     let b=40

//     console.log(a)
//     console.log(b)

//     if(true){
//         let a=50
//         var c=60

//         console.log(a)
//         console.log(b)
//         console.log(c)

//     }
//     console.log(a)
//     console.log(b)
//     console.log(c)

// }
// console.log(a)
// console.log(b)
// console.log(c)

//temporal dead zone - access without declaring(let or const)
// console.log(a)
// let a=10


//normal function
// function fn(){
//     console.log(10+20)
// }
// fn()

//arrow function
// let fn=() => {
//     console.log("hello")
// }
// fn()

// function expression
// iife - immediately involve function
// arrow optics 
// asyncronous
// api