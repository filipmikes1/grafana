import React, { FunctionComponent } from 'react';
import { SvgProps } from '../types';

export const PerconaSetting: FunctionComponent<SvgProps> = ({ size, ...rest }) => {
  return (
    <svg width={size} height={size} {...rest} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.943 11.1929C18.7747 11.0013 18.6819 10.755 18.6819 10.5C18.6819 10.245 18.7747 9.99868 18.943 9.80709L20.2869 8.2953C20.4349 8.13012 20.5269 7.92229 20.5495 7.70161C20.5722 7.48094 20.5243 7.25876 20.4128 7.06697L18.3131 3.43446C18.2028 3.24288 18.0348 3.09103 17.8331 3.00054C17.6314 2.91005 17.4062 2.88555 17.1898 2.93053L15.2161 3.32948C14.9649 3.38137 14.7035 3.33954 14.481 3.21189C14.2586 3.08424 14.0906 2.87959 14.0087 2.63657L13.3683 0.715331C13.2979 0.506807 13.1637 0.325692 12.9847 0.197585C12.8057 0.0694784 12.591 0.000859619 12.3709 0.00142776H8.17151C7.94257 -0.0105218 7.71602 0.0527935 7.52644 0.181703C7.33687 0.310613 7.1947 0.49803 7.12165 0.715331L6.53373 2.63657C6.45185 2.87959 6.28384 3.08424 6.06142 3.21189C5.839 3.33954 5.57754 3.38137 5.3264 3.32948L3.30017 2.93053C3.09498 2.90153 2.8858 2.93391 2.69897 3.02359C2.51215 3.11326 2.35604 3.25623 2.25032 3.43446L0.150603 7.06697C0.0363366 7.25662 -0.0150412 7.47755 0.0038147 7.69817C0.0226706 7.91878 0.110795 8.12779 0.255589 8.2953L1.58891 9.80709C1.75722 9.99868 1.85004 10.245 1.85004 10.5C1.85004 10.755 1.75722 11.0013 1.58891 11.1929L0.255589 12.7047C0.110795 12.8722 0.0226706 13.0812 0.0038147 13.3018C-0.0150412 13.5224 0.0363366 13.7434 0.150603 13.933L2.25032 17.5655C2.36065 17.7571 2.52865 17.909 2.73037 17.9995C2.93208 18.0899 3.15721 18.1144 3.37366 18.0695L5.3474 17.6705C5.59854 17.6186 5.85999 17.6605 6.08241 17.7881C6.30484 17.9158 6.47284 18.1204 6.55473 18.3634L7.19514 20.2847C7.26819 20.502 7.41036 20.6894 7.59993 20.8183C7.78951 20.9472 8.01606 21.0105 8.245 20.9986H12.4444C12.6645 20.9991 12.8792 20.9305 13.0582 20.8024C13.2372 20.6743 13.3714 20.4932 13.4418 20.2847L14.0822 18.3634C14.1641 18.1204 14.3321 17.9158 14.5545 17.7881C14.7769 17.6605 15.0384 17.6186 15.2895 17.6705L17.2633 18.0695C17.4797 18.1144 17.7049 18.0899 17.9066 17.9995C18.1083 17.909 18.2763 17.7571 18.3866 17.5655L20.4863 13.933C20.5978 13.7412 20.6457 13.5191 20.623 13.2984C20.6004 13.0777 20.5084 12.8699 20.3604 12.7047L18.943 11.1929ZM17.3788 12.5997L18.2186 13.5446L16.8748 15.8753L15.636 15.6233C14.8799 15.4687 14.0933 15.5972 13.4256 15.9842C12.7579 16.3713 12.2556 16.99 12.014 17.723L11.615 18.8989H8.92741L8.54946 17.702C8.30784 16.9691 7.80551 16.3503 7.13783 15.9633C6.47014 15.5762 5.68358 15.4477 4.92745 15.6023L3.68862 15.8543L2.32381 13.5341L3.16369 12.5892C3.68018 12.0118 3.96571 11.2642 3.96571 10.4895C3.96571 9.71478 3.68018 8.96723 3.16369 8.38979L2.32381 7.44492L3.66762 5.13523L4.90646 5.3872C5.66258 5.54176 6.44915 5.41332 7.11683 5.02625C7.78451 4.63919 8.28684 4.02045 8.52846 3.28748L8.92741 2.10114H11.615L12.014 3.29798C12.2556 4.03095 12.7579 4.64969 13.4256 5.03675C14.0933 5.42381 14.8799 5.55226 15.636 5.39769L16.8748 5.14573L18.2186 7.47641L17.3788 8.42128C16.8681 8.9974 16.5861 9.74062 16.5861 10.5105C16.5861 11.2804 16.8681 12.0236 17.3788 12.5997ZM10.2712 6.30057C9.44066 6.30057 8.62874 6.54686 7.93815 7.0083C7.24756 7.46974 6.7093 8.1256 6.39146 8.89295C6.07361 9.66029 5.99045 10.5047 6.15249 11.3193C6.31452 12.1339 6.71448 12.8821 7.30178 13.4694C7.88908 14.0567 8.63735 14.4567 9.45196 14.6187C10.2666 14.7808 11.1109 14.6976 11.8783 14.3798C12.6456 14.0619 13.3015 13.5237 13.7629 12.8331C14.2244 12.1425 14.4707 11.3306 14.4707 10.5C14.4707 9.38624 14.0282 8.3181 13.2407 7.53056C12.4531 6.74301 11.385 6.30057 10.2712 6.30057ZM10.2712 12.5997C9.85594 12.5997 9.44998 12.4766 9.10469 12.2458C8.75939 12.0151 8.49026 11.6872 8.33134 11.3035C8.17242 10.9199 8.13084 10.4977 8.21186 10.0904C8.29288 9.68306 8.49285 9.30893 8.7865 9.01528C9.08015 8.72163 9.45429 8.52165 9.86159 8.44063C10.2689 8.35961 10.6911 8.40119 11.0748 8.56012C11.4584 8.71904 11.7864 8.98817 12.0171 9.33346C12.2478 9.67876 12.3709 10.0847 12.3709 10.5C12.3709 11.0569 12.1497 11.5909 11.7559 11.9847C11.3622 12.3785 10.8281 12.5997 10.2712 12.5997Z"
        fill="#9FA7B3"
      />
    </svg>
  );
};