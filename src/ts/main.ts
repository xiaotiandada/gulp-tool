import { sayHello } from "./greet";
import { con } from './con'

function showHello(divName: string, name: string) {
    let test = '123'
    console.log(`test var ${test} es6`)
    const elt = document.getElementById(divName);
    elt.innerText = sayHello(name);
}
console.log(con('con'))
showHello("greeting", "TypeScript test ts");