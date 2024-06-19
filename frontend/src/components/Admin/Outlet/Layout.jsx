import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-grow flex-col">
            <nav className="flex h-16 bg-emerald-300 mb-3 items-center px-3  justify-between">
                <Link className="font-semibold" to='/admin/application'>
                    <h1 className="text-xl font-semibold text-emerald-800">Admin</h1>
                </Link>
                <div>
                    <Button onClick={() => {
                        if (window.confirm('Are you sure?')) {
                            localStorage.clear()
                            window.location.reload();
                        }
                    }}/*  */ variant='destructive'>Logout</Button>
                </div>
            </nav>
            <div className="flex flex-grow gap-2 px-2">
                <div className="flex flex-col bg-gray-300 rounded-t-md gap-1 flex-grow">
                    <Link to='/admin/application' className="py-2 px-2 border text-gray-500  bg-slate-200">Application</Link>
                    <Link to='/admin/users' className="py-2 px-2 bg-slate-200 text-gray-500">Users</Link>
                    <Link to='/admin/agents' className="py-2 px-2 border  bg-slate-200 text-gray-500">Agents</Link>
                    <Link to='/admin/transactions' className="py-2 px-2 border  bg-slate-200 text-gray-500">Transactions</Link>
                </div>
                <div className="w-[70%] flex flex-col flex-grow">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
