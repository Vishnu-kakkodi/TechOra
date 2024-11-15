declare module 'react-stars' {
    import { Component } from 'react';
  
    interface ReactStarsProps {
      count?: number;
      value?: number;
      onChange?: (newValue: number) => void;
      size?: number;
      color1?: string;
      color2?: string;
      edit?: boolean;
      half?: boolean;
    }
  
    export default class ReactStars extends Component<ReactStarsProps> {}
  }
  