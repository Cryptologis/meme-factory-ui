import Navbar from "../Navbar";

export default function NavbarExample() {
  return (
    <Navbar
      walletConnected={true}
      walletAddress="7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
      balance={12.45}
    />
  );
}
