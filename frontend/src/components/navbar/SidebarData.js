import React from "react";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
    {
        title: "Уроки",
        path: "/lessons",
        icon: <AiIcons.AiFillHome />,
        cName: "nav-text"
    },
    {
        title: "Учні",
        path: "/students",
        icon: <IoIcons.IoIosPaper />,
        cName: "nav-text"
    },
    {
        title: "Додати учня",
        path: "/add-student",
        icon: <FaIcons.FaCartPlus />,
        cName: "nav-text"
    },
    {
        title: "Додати урок",
        path: "/add-lesson",
        icon: <IoIcons.IoMdPeople />,
        cName: "nav-text"
    },
    {
        title: "Вийти",
        path: "/exit",
        icon: <FaIcons.FaCartPlus />,
        cName: "nav-text"
    }
];
