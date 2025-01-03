import { NavLink, Outlet } from "react-router-dom"

const CategoryLayout =() => {
    return (
        <div className="container mt-3">
            <h1 className="text-center">Shop by Category</h1>
            <div className="d-flex justify-content-center mb-4">
                <NavLink to="/category/beauty" className="btn btn-outline-primary mx-2">Beauty</NavLink>
                <NavLink to="/category/fragrances" className="btn btn-outline-primary mx-2">Fragrances</NavLink>
                <NavLink to="/category/furniture" className="btn btn-outline-primary mx-2">Furniture</NavLink>
                <NavLink to="/category/groceries" className="btn btn-outline-primary mx-2">Groceries</NavLink>
            </div>

            <Outlet />

        </div>
    )
}

export default CategoryLayout;