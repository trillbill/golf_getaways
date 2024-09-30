import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Golf Getaways",
  description: "Find your perfect golf getaway",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <meta name="google-adsense-account" content="ca-pub-2339342939361274" /> */}
        <meta name="description" content="Golf Getaways helps you find your perfect golf trip within your budget" />
        <meta name="keywords" content="golf, getaways, travel, courses, vacations, packages, stay and play, golfing, resort" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(d,z,s){s.src='https://'+d+'/400/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('aupoafto.com',8152552,document.createElement('script'))`
          }}
        />
      </body>
    </html>
  );
}
