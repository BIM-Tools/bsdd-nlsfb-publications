declare module "react-world-flags" {
  import { CSSProperties } from "react";

  export interface FlagProps {
    code: string;
    style?: CSSProperties;
  }

  const Flag: React.FC<FlagProps>;
  export default Flag;
}
