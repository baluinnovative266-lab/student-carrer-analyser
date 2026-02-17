import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <nav className="flex px-4 py-3 text-slate-400 text-sm font-medium" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center hover:text-blue-400 transition-colors duration-200"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Dashboard
                    </Link>
                </li>
                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                    // Capitalize and format the name
                    const name = value
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');

                    return (
                        <li key={to}>
                            <div className="flex items-center">
                                <ChevronRight className="w-4 h-4 mx-1" />
                                {last ? (
                                    <span className="text-white font-semibold">
                                        {name === "Full" ? "Career Journey" : name}
                                    </span>
                                ) : (
                                    <Link
                                        to={to}
                                        className="hover:text-blue-400 transition-colors duration-200"
                                    >
                                        {name}
                                    </Link>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
