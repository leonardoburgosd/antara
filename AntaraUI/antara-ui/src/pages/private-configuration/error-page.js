import React from "react";
import '../../design/css/styles.css'
import '../../design/css/error.css'
class ErrorPage extends React.Component {
    render() {
        return (
            <div className="error-template">
                <h1>
                    <i className="fas fa-exclamation-triangle"></i> Oops!</h1>
                <h2>
                    404 Not Found</h2>
                <div className="error-details">
                    Página no encontrada.
                </div>
            </div>
        )
    }
}
export default ErrorPage
