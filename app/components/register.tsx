import { useState } from 'react';
import { Link } from 'react-router';

const registrar = async (data) => {
    alert("registra: " + data.user + "-" + data.password + "-" + data.mail)
    try {
        const res = await fetch('http://localhost:3001/api/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: data.mail,
                password: data.password,
                user: data.user
            })
        });

    } catch (error) {
        console.error("Error:", error);
    }

};

const validar = async (data) =>{
    try {
        const res = await fetch('http://localhost:3001/api/verificar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: data.mail,
                codigo: data.code
            })
        });
        alert(res)
    } catch (error) {
        console.error("Error:", error);
    }
}

export const Register = () => {
    const [user, setUser] = useState("");
    const [password, setpassword] = useState("");
    const [mail, setmail] = useState("");
    const [code, setCode] = useState("");
    return (
        <div className='flex flex-col w-1/1 h-1/1'>
            <h1 className='h-1/10 font-bold'>Register</h1>

            <form className='flex flex-col h-4/5'>
                <div>
                    <label htmlFor="user">Usuario</label>
                    <input type="text" id='user' value={user} onChange={(e) => setUser(e.target.value)} className='bg-white' />
                </div>
                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input type="text" id='password' value={password} onChange={(e) => setpassword(e.target.value)} className='bg-white' />
                </div>
                <div>
                    <label htmlFor="mail">Correo</label>
                    <input type="text" id='mail' value={mail} onChange={(e) => setmail(e.target.value)} className='bg-white' />
                </div>
                <button onClick={(e) => {
                    e.preventDefault();
                    const data = { user: user, password: password, mail: mail }
                    registrar(data)
                }} className='border-2'>Registrar</button>
            </form>

            <form>
                <div>
                    <label htmlFor="code">Correo</label>
                    <input type="text" id='code' value={code} onChange={(e) => setCode(e.target.value)} className='bg-white' />
                </div>
                <button onClick={(e) => {
                    e.preventDefault();
                    const data = { code: code, mail: mail }
                    validar(data)
                }} className='border-2'>Registrar</button>
            </form>

            <button className='h-1/10'>
                <Link to='../Login' state={{ tipo: false }}>
                    Login
                </Link>
            </button>
        </div>
    );
}