import { NavLink } from "react-router-dom";


const ErrorPage = () => {
    return (
        <div className="container text-center mt-5">
            <h1 className="display-3 text-danger">Error 404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="mb-4">Page you're looking for doesn't exist or has been removed.</p>
            <NavLink to="/" className="btn btn-primary">Back to Home</NavLink>
        </div>
    )
}


export default ErrorPage;