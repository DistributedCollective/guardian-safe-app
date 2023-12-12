import { AddressBadge, Header } from "@sovryn/ui";
import { Outlet } from "react-router-dom";
import { LinkAccountToExplorer } from "../components/LinkToExplorer/LinkToExplorer";
import { useAccount } from "../hooks/useAccount";
import { useMultisigData } from "../hooks/useMultisigData";
import { NavItem } from "../components/NavItem/NavItem";

export const Root = () => {

  const { address } = useAccount();
  const { data, loading } = useMultisigData();

  return (
    <>
      <Header menuItems={
        <ol className="flex flex-col gap-4 lg:flex-row w-full lg:w-auto">
          <li>
            <NavItem to="/">Review</NavItem>
          </li>
          <li>
            <NavItem to="/vetoed">Vetoed</NavItem>
          </li>
        </ol>
      } secondaryContent={
        <ol className="flex flex-row justify-between gap-3">
          <li>
            <LinkAccountToExplorer value={address ?? '0x0'} label={<AddressBadge address={address!} />} />
          </li>
          {!loading && <li>{data.owners.some(item => item.id.toLowerCase() === address?.toLowerCase()) ? 'Owner' : 'Not Owner'}</li>}
        </ol>
      } />
      <div className="container my-12 max-w-2xl bg-gray-90 py-4 rounded">
        <Outlet />
      </div>
    </>
  );
}
