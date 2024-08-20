"use client";

import { FC } from "react";

type Props = {
  bg_color: string;
  title: string;
  value: number;
};

const ReportProgress: FC<Props> = ({ title, value }) => {
  return (
    <div>
      <h5 className="text-gray-900 mb-2 text-3xl font-bold dark:text-white">
        {title}
      </h5>
      <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
        {value}
      </p>
      <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
        {value}
      </p>
    </div>
  );
};

export default ReportProgress;
