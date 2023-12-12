import { FC } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

export const NavItem: FC<NavLinkProps> = (props) => {
  return <NavLink
      className={({ isActive }) =>
      [
        'rounded-b-none text-gray-30 font-normal text-sm hover:bg-gray-70 hover:text-gray-10 min-w-auto w-full lg:w-auto lg:rounded p-4 no-underline',
        isActive ? "bg-gray-70" : "bg-transparent border-none",
      ].join(" ")
    }
      end
      {...props}
    />
};
