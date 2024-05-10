import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import { useStoreContext } from "@/store/StoreProvider";

export default function Navbar() {
  const { setUser } = useStoreContext();

  return (
    <div className="flex font-poppins items-center justify-between py-4 bg-white dark:bg-gray-800">
      <Link className="flex items-center gap-2" to='/'>
        <MountainIcon className="h-6 w-6" />
        <span className="text-lg font-semibold">Real State</span>
      </Link>
      <div className="hidden lg:flex gap-6 items-center">
        <Link className="text-sm  hover:underline underline-offset-4" href="#">
          Home
        </Link>
        <Link className="text-sm  hover:underline underline-offset-4" href="#">
          Smart Search
        </Link>
        <Link className="text-sm  hover:underline underline-offset-4" href="#">
          About
        </Link>
        <Link className="text-sm  hover:underline underline-offset-4" to='/profile'>
          Profile
        </Link>
        <Button
          variant="destructive"
          onClick={() => {
            if (!window.confirm("Are you sure?")) return;
            localStorage.clear();
            setUser({
              is_auth: false,
              id: "",
              token: "",
            });
          }}
        >
          Logout
        </Button>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button className="lg:hidden" size="icon" variant="outline">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="grid w-[200px] space-y-5 p-4">
            <Link
              className="text-sm  hover:underline underline-offset-4"
              to={'/'}
            >
              Home
            </Link>
            <Link
              className="text-sm  hover:underline underline-offset-4"
              href="#"
            >
              Smart Search
            </Link>
            <Link
              className="text-sm  hover:underline underline-offset-4"
              href="#"
            >
              About
            </Link>
            <Link
              className="text-sm  hover:underline underline-offset-4"
              to={'/profile'}
            >
              Profile
            </Link>
            <Button
              variant="destructive"
              onClick={() => {
                if (!window.confirm("Are you sure?")) return;

                localStorage.clear();
                setUser({
                  is_auth: false,
                  id: "",
                  token: "",
                });
              }}
            >
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
