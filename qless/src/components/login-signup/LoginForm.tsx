import supabase from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';

type LoginFormProps = {
    handleLoginAttempt: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ handleLoginAttempt }) => {

    const navigate = useNavigate();

    const handleLoginSubmission = async (event: React.FormEvent<HTMLFormElement>)=> {
        event.preventDefault();
        handleLoginAttempt();
        const loginErrorNotification = document.getElementById('loginErrorNotification');
        if (loginErrorNotification === null){
            return;
        }
        const formData = new FormData(event.currentTarget);
        const email = formData.get("emailLogin") as string;
        const password = formData.get("passwordLogin") as string;

        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            if (authData.user !== null && authData.session !== null){
                console.log(`successfully logged in ${authData.user.user_metadata.first_name}`);
                const { data: userData, error: userError } = await supabase.from("user").select();
                if (userData){
                    if (userData[0].isManager === true){
                        const manager = userData[0];
                        navigate('/manage', { state: { manager }});
                    }
                    else {
                        const employee = userData[0];
                        navigate('/cook', { state: { employee }});
                    }
                }
                
            }
            else if (authError !== null){
                console.log(`Error logging in that user: ${authError.code}`);
                //add specific error handling depending on error.code
                if (authError.code === 'invalid_credentials'){
                    loginErrorNotification.innerText = "Invalid credentials. Check your email and password and try again."
                }
                else{
                    loginErrorNotification.innerText = "Error logging in, please try again."
                }
            }
            else{
                console.log(`An unexpected error occured during the login process.`);
                loginErrorNotification.innerText = "An unexpected error occured while logging in. Please try again or contact support."
            }
        }
        catch (err){
           console.log("Unable to complete login request... ", err);
        }

    }

    return (
        <div>
            <h1>Login Form</h1>
            <form onSubmit={handleLoginSubmission}>
                <input id='emailLogin' name="emailLogin" type="email" placeholder="Email" />
                <input id='passwordLogin' name="passwordLogin" type="password" placeholder="Password" />
                <button type="submit">Login</button>
                
                <p id='loginErrorNotification' className='errorNotificationText'></p>
            </form>
        </div>
    )
}


export default LoginForm;