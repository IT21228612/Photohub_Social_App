'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">HomeStock</span>
            <img
              alt="HomeStock Logo"
              src="/HS_logo.png"
              className="h-16 w-auto"
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          {/* Inventory Menu with Dropdown */}
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold text-gray-900">
              Inventory
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
            </PopoverButton>
            <PopoverPanel className="absolute top-full left-0 z-10 mt-3 w-40 rounded-md bg-white shadow-lg ring-1 ring-gray-900/5">
              <div className="p-2">
                <Link to="/inventoryReport" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 rounded-md">
                  Report
                </Link>
                <Link to="/inventory" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 rounded-md">
                  My Inventory
                </Link>
              </div>
            </PopoverPanel>
          </Popover>

          {/* Other Menu Items */}
          <Link to="#" className="text-sm font-semibold text-gray-900">
            My Profile
          </Link>
          <Link to="#" className="text-sm font-semibold text-gray-900">
            Recipes
          </Link>
          <Link to="#" className="text-sm font-semibold text-gray-900">
            Insights
          </Link>
        </PopoverGroup>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link to="#" className="text-sm font-semibold text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">HomeStock</span>
              <img
                alt="HomeStock Logo"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {/* Inventory Dropdown in Mobile View */}
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base font-semibold text-gray-900 hover:bg-gray-50">
                    Inventory
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    <Link to="#" className="block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold text-gray-900 hover:bg-gray-50">
                      Report
                    </Link>
                    <Link to="/inventory" className="block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold text-gray-900 hover:bg-gray-50">
                      My Inventory
                    </Link>
                  </DisclosurePanel>
                </Disclosure>

                <Link to="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">
                  My Profile
                </Link>
                <Link to="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">
                  Recipes
                </Link>
                <Link to="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">
                  Insights
                </Link>
              </div>
              <div className="py-6">
                <Link to="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
