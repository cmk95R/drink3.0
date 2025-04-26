import nodemailer from "nodemailer";

export const mReestablecer = async (req, res) => {
    const { name, email } = req.body;
    const resetLink = `http://localhost:4000/api/change-password`;
    // Contenido a enviar del mail
    const contentHTMl = `
    <head>
        <style>
        h1{font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;}
        p{font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:rgb(202, 111, 30); font-weight: 500;}
        div{background-color: aliceblue; margin: 20px; padding: 5px;}
        button{background-color: rgb(93, 173, 226); border-radius: .1rem; padding: .5rem; border: 1px black solid;}
        a{color: white; text-decoration: none;}
        </style>
    </head>
        <body>
            <div>
                <h1>Reestablecer contraseña</h1>
                <p>Se ha enviado una petición para reestablecer la contraseña en esta dirección de correo electrónico.</p>
                <p>Para validar el reestablecimiento de contraseña, por favor clicke el botón "Reestablecer Contraseña".</p>
                <p>Si esta petición no fue enviada por usted, contacte con el soporte.</p>
                <button>
                    <a href="${resetLink}" class="btn">Reestablecer Contraseña</a>
                </button>
                <p><strong>Drinks in the house</strong></p>
            </div>
        </body>
    `;

    try {
        // Transporter para enviar mail
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // SSL
            auth: {
                user: 'drinksinthehouse57@gmail.com', // dirección gmail a usar
                pass: 'bnkp luas bqwx ifra' // contraseña de aplicación
            }
        });

        // Enviar el correo
        const info = await transporter.sendMail({
            from: "'Drinks in the house' <drinksinthehouse57@gmail.com>",
            to: email,
            subject: 'Reestablecer Contraseña - ',
            html: contentHTMl
        });

        console.log('Message sent', info.messageId);

        // Respuesta al cliente después de enviar el correo
        return res.redirect ("/api/login")
        
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({ message: 'Error al enviar el correo.' });
    }
};
