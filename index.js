const  base = indexedDB.open("base",1);
function sendData(modo){
    const dataBase = base.result; 
    const IDBtransaction = dataBase.transaction("nombres",modo);
    return IDBtransaction;
} 
const nombresHTML = (id,nam) => {
    const fragmento = document.createDocumentFragment();
    const container = document.createElement("DIV");    
    const check = document.createElement("INPUT");
    const letra = document.createElement("H3");
    const addbutton = document.createElement("BUTTON");
    const delbutton = document.createElement("BUTTON");
    

    container.classList.add("lista");
    check.classList.add("check");
    letra.classList.add("nombres");
    addbutton.classList.add("imposible");
    delbutton.classList.add("del");

    addbutton.textContent = "guardar";
    delbutton.textContent = "eliminar";
    letra.textContent = nam.nombre;

    check.setAttribute("type","checkbox");
    letra.setAttribute("contenteditable","true");
    letra.setAttribute("spellcheck","false")
    fragmento.appendChild(check);
    fragmento.appendChild(letra);
    fragmento.appendChild(addbutton);
    fragmento.appendChild(delbutton);  
    container.appendChild(fragmento);

    letra.addEventListener("keyup",()=>{
        addbutton.classList.replace("imposible","posible");
    })
    addbutton.addEventListener("click",()=>{
        if(addbutton.className == "posible"){
            
            modificar(id,{nombre : letra.textContent});
            addbutton.classList.replace("posible","imposible");
        }
            
    })
    delbutton.addEventListener("click",()=>{
        eliminar(id);
        document.querySelector(".añadir").removeChild(container);

    })
    let conteo = 0;
    check.addEventListener("click", () => {
        console.log("probando checkbox")
        conteo++;
        if(conteo%2 !== 0){
            container.style = "background-color:rgb(196, 254, 196);"
            letra.style = "border-color: grey;"
        }else{
            container.style = "background-color:rgba(238, 238, 238, 0.899);"
            letra.style = "border-color: rgb(2, 144, 210);"
        }
    })

    return container;
}


base.addEventListener("upgradeneeded", ()=>{
    const dataBase = base.result; 
    dataBase.createObjectStore("nombres",{
        autoIncrement: true
    });
    
})
base.addEventListener("success", ()=>{
    leer();

} )

//añadir
const addObjeto = objeto =>{
    const objStore = sendData("readwrite").objectStore("nombres");
    objStore.add(objeto);
} 
const modificar = (key,ob) =>{
    const objStore = sendData("readwrite").objectStore("nombres");
    objStore.put(ob,key);
} 
const eliminar = key => {
    const objStore = sendData("readwrite").objectStore("nombres");
    objStore.delete(key);
}
const leer  = () => {
    const objStore = sendData("readonly").objectStore("nombres");
    const cursor = objStore.openCursor()
    document.querySelector(".añadir").innerHTML = ""; 
    const fragment = document.createDocumentFragment();
    cursor.addEventListener("success",()=>{
    if(cursor.result){
            let elemento = nombresHTML(cursor.result.key,cursor.result.value);
            fragment.appendChild(elemento);
            cursor.result.continue();
        }else document.querySelector(".añadir").appendChild(fragment);
    }) 
}




document.getElementById("add").addEventListener("click",(e)=>{
    console.log("clickeado")
    e.preventDefault();
    let entrada = document.getElementById("name").value;
    if(entrada.length>0){
        addObjeto({nombre:entrada}); 
        leer();
    }  
})

 
