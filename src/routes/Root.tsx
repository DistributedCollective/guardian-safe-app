import { Header } from "@sovryn/ui";
import { Link, Outlet } from "react-router-dom";
import { LinkAccountToExplorer } from "../components/LinkToExplorer/LinkToExplorer";
import { useAccount } from "../hooks/useAccount";

export const Root = () => {

  const { address } = useAccount(); 

  return (
    <>
      <Header menuItems={
        <ol>
          <li>
            <Link to="/">Review</Link>
          </li>
          <li>
            <Link to="/vetoed">Vetoed</Link>
          </li>
        </ol>
      } secondaryContent={
        <ol>
          <li>
            <LinkAccountToExplorer value={address ?? '0x0'} />
          </li>
        </ol>
      } />
      <div className="container my-8">
        <Outlet />
      </div>
    </>
  );
}