import { Menu, Transition } from "@headlessui/react";
import { useAuth } from "@/lib/auth";
import { Avatar } from "../Avatar";
import Link from "next/link";

export function AvatarMenu() {
  const { user, signOut } = useAuth();
  return (
    <div className="flex items-center justify-center">
      <div className="relative inline-block text-left">
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button className="rounded-full">
                <Avatar size="h-9 w-9" fontSize="lg" />
              </Menu.Button>

              <Transition
                show={open}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="z-50 absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                >
                  <div className="px-4 py-3">
                    <p className="text-sm leading-5">Signed in as</p>
                    <p className="text-sm font-medium leading-5 text-gray-900 truncate capitalize">
                      {user.first_name} {user.last_name}
                    </p>
                  </div>

                  <div>
                    <MenuItem url="/dashboard" title="Dashboard" />

                    <MenuItem
                      url="/dashboard/reservations"
                      title="Reservations"
                    />
                    <MenuItem url="/dashboard/groups" title="Groups" />
                  </div>

                  <div className="py-1">
                    <MenuItem
                      url="/dashboard/settings"
                      title="Account Settings"
                    />
                  </div>

                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <div
                          onClick={signOut}
                          className={`${active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700"
                            } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left cursor-pointer`}
                        >
                          Sign Out
                        </div>
                      )}
                    </Menu.Item>
                  </div>

                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    </div>
  );
}

const MenuItem = ({ url, title }: { url: string; title: string }) => (
  <Link href={url}>
    <Menu.Item>
      {({ active }) => (
        <a
          className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"
            } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left hover:bg-gray-100 hover:text-gray-900 cursor-pointer`}
        >
          {title}
        </a>
      )}
    </Menu.Item>
  </Link>
);
