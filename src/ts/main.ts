import { sayHello } from "./greet";

function showHello(divName: string, name: string) {
    let test = '123'
    console.log(`test var ${test} es6`)
    const elt = document.getElementById(divName);
    elt.innerText = sayHello(name);
}

showHello("greeting", "TypeScript test");