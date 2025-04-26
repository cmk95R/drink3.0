import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router(); // Enrutador

export const mConfirmacion = async (req, res) => { // No necesitas Router aquí
    const { name, email, message } = req.body;

    // Contenido a enviar del mail
    const contentHTML = `
    <head>
        <style>
            h1{font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;}
            p{font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:rgb(202, 111, 30); font-weight: 500;}
            div{background-color: aliceblue; margin: 20px; padding: 5px;}
            button{background-color: rgb(93, 173, 226); border-radius: .1rem; padding: .5rem; border: 1px black solid;}
        </style>
    </head>
    <body>
        <div>
            <h1>Verificación de correo electrónico</h1>
            <p>Se ha creado una cuenta en Drunk In The House con el siguiente correo electrónico: ${email}</p>
            <p>Para activar la cuenta, por favor clicke el botón "Confirmar Mail".</p>
            <p>Si esta cuenta no fue creada por usted, ignore el mail.</p>
            <button>Activar cuenta</button>
            <p><strong>Drunk in the house</strong></p>
        </div>
    </body>
    `;

    // Transportador para enviar el mail
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: 'drinksinthehouse57@gmail.com',
            pass: 'bnkp luas bqwx ifra' // Usa una contraseña de aplicación
        }
    });

    try {
        const info = await transporter.sendMail({
            from: "'Drinks in the house' <drinksinthehouse57@gmail.com>",
            to: email,
            subject: 'Verificación de Cuenta - ',
            html: contentHTML
        });

        console.log('Message sent', info.messageId);
    } catch (error) {
        console.error('Error sending email', error);
        return res.status(500).send('Error al enviar el correo electrónico');
    }
};

export default mConfirmacion;