"use client"

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {

  const pathname = usePathname()
  const params = useParams()

  const routes = [
    {
      href: `/${params.storeId}`,
      active: pathname === `/${params.storeId}`,
      label: 'Overview'
    },
    {
      href: `/${params.storeId}/billboards`,
      active: pathname === `/${params.storeId}/billboards`,
      label: 'Billboards'
    },
    {
      href: `/${params.storeId}/categories`,
      active: pathname === `/${params.storeId}/categories`,
      label: 'Categories'
    },
    {
      href: `/${params.storeId}/sizes`,
      active: pathname === `/${params.storeId}/sizes`,
      label: 'Sizes'
    },
    {
      href: `/${params.storeId}/colors`,
      active: pathname === `/${params.storeId}/colors`,
      label: 'Colors'
    },
    {
      href: `/${params.storeId}/products`,
      active: pathname === `/${params.storeId}/products`,
      label: 'Products'
    },
    {
      href: `/${params.storeId}/orders`,
      active: pathname === `/${params.storeId}/orders`,
      label: 'Orders'
    },
    {
      href: `/${params.storeId}/settings`,
      active: pathname === `/${params.storeId}/settings`,
      label: 'Settings'
    },
  ]


  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      {routes.map(route => (
        <Link
          key={route.href}
          href={route.href}
          className={cn('text-sm font-medium hover:text-primary transition-colors', route.active ? 'text-black dark:text-white': 'text-muted-foreground')}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}

export default MainNav
