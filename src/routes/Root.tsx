import { AddressBadge, Header } from "@sovryn/ui";
import { Link, Outlet } from "react-router-dom";
import { LinkAccountToExplorer } from "../components/LinkToExplorer/LinkToExplorer";
import { useAccount } from "../hooks/useAccount";
import { useMultisigData } from "../hooks/useMultisigData";

export const Root = () => {

  const { address } = useAccount();
  const { data, loading } = useMultisigData();

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
