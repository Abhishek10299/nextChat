import NavBar from "@/components/navbar/NavBar";


export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div>
        <NavBar/>
        {children}
        </div>
    );
  }
  