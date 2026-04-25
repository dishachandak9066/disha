//callback function
// function greet(name,callback){
//     console.log("hello" +name)
//     callback();
// }
// function saybye(){
//     console.log("goodbye")
// }
// greet("suraj ",saybye)


// setTimeout(function(){
//     console.log("runs after 2 seconds")
// },2000)

//with callback function
// setTimeout(hello,2000)    //callback functn
// function hello(){
//     console.log("runs after 2 sec")
// }

//interval function
// setInterval(function(){
//     console.log("hello")
// },2000)                         //ctrl c to stop

// var a=10
// let b=20
// const c=30
// setTimeout(() =>{
//     console.log("1:",a)
// },1000)
// setTimeout(() =>{
//     console.log("2:",b)
// },1000)
// setTimeout(() =>{
//     console.log("3:",c)
// },1000)
// a=100
// b=200
// console.log("4:",a)
// console.log("5:",b)
// console.log("6:",c)

// var a=5
// let b=10
// const c=15

// setTimeout(()=>{
//     a=a+5;
//     b=b+5
//     console.log("1:",a,b,c)
// },1000)

// console.log("2:",a,b,c)
// a=20
// b=30
// console.log("3:",a,b,c)


// var a=1
// let b=2
// const c=3
// setTimeout(()=>{
//     console.log("1:",a,b,c)
// })

// console.log("A")
// setTimeout(() => console.log("B"),0)
// console.log("C")
// setTimeout(() => {
//     console.log("D")
//     setTimeout(() => console.log("E"),0)
// }, 0);
// console.log("F")
// setTimeout(() =>console.log("G"),0)
// console.log("H")

//homework - 24 april
//Event loop - what the heck is event loop anyway? -jsconf
//local and session storage(Google)
//lexical scoping
//clear timeout

//homework - 25 april
//put
//patch

// fetch - help fetch Api
// await - waits till data comes from db
// async - to get data from db

//API calling
// async function getUsers(){
//     try{
//         const response=await fetch("https://dummyjson.com/post")
//         const data=await response.json()
//         console.log(data)
//     }
//     catch(error){
//         console.log(error)
//     }
// }
// getUsers()

// async function getUsers(){
//     try{
//         const response=await fetch("https://dummyjson.com/recipes")
//         const data=await response.json()
//         console.log(data)
//     }
//     catch(error){
//         console.log(error)
//     }
// }
// getUsers()

// async function loginUser(){
//     const res=await fetch("https://dummyjson.com/auth/login",{
//         method:"POST",
//         headers:{
//             "Content-Type":"application/json"
//         },
//         body:JSON.stringify({
//             username:"emilys",
//             password:"emilyspass"
//         })
//     })
//     const data=await res.json()
//     console.log(data)
// }
// loginUser()


//github - repository - new 