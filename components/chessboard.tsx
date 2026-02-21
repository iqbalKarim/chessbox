"use client";

// deprecated next-chessground file

// import dynamic from "next/dynamic";
// import { ComponentProps, useEffect, useState } from "react";

// // Dynamically import the component with SSR disabled
// const NextChessground = dynamic(() => import("next-chessground").then((mod) => mod.NextChessground), { ssr: false });

// type ChessProps = ComponentProps<typeof NextChessground>;

// export default function ChessBoard(props: ChessProps) {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     // Return a placeholder with the same dimensions to avoid layout shift
//     return <div style={{ width: "400px", height: "400px", background: "#f0f0f0" }} />;
//   }

//   return (
//     <div style={{ width: "400px", height: "400px" }}>
//       <NextChessground {...props} />
//     </div>
//   );
// }
