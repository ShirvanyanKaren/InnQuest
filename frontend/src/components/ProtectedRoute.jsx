import Auth from "../utils/auth";

const ProtectedRoute = ({ component: Component, ...rest }) => {

    const redirectTo = () => {
        window.location.replace("/admin/login");
    }

    return (
        <div>
            {Auth.loggedIn() ? <Component {...rest} /> : redirectTo()}
        </div>
    );
}

export default ProtectedRoute;