# Explicit Runge-Kutta methods of high order

## $p = 5$

One example is

$$
\begin{matrix}
0 \\ \\
\frac{1}{4} & \frac{1}{4} \\ \\
\frac{1}{4} & \frac{1}{8} & \frac{1}{8} \\ \\
\frac{1}{2} & 0 & 0 & \frac{1}{2} \\ \\
\frac{3}{4} & \frac{3}{16} & -\frac{3}{8} & \frac{3}{8} & \frac{9}{16} \\ \\
1 & -\frac{3}{7} & \frac{8}{7} & \frac{6}{7} & -\frac{12}{7} & \frac{8}{7} \\ \\
& \frac{7}{90} & 0 & \frac{16}{45} & \frac{2}{15} & \frac{16}{45} & \frac{7}{90}
\end{matrix}
$$

Original Kutta method corrected by Nystr&ouml;m

$$
\begin{matrix}
0 \\ \\
\frac{1}{3} & \frac{1}{3} \\ \\
\frac{2}{5} & \frac{4}{25} & \frac{6}{25} \\ \\
1 & \frac{1}{4} & -3 & \frac{15}{4} \\ \\
\frac{2}{3} & \frac{2}{27} & \frac{10}{9} & -\frac{50}{81} & \frac{8}{81} \\ \\
\frac{4}{5} & \frac{2}{25} & \frac{12}{25} & \frac{2}{15} & \frac{8}{75} & 0 \\ \\
& \frac{23}{192} & 0 & \frac{125}{192} & 0 & -\frac{27}{64} & \frac{125}{192}
\end{matrix}
$$

## $p = 6$

Minimal number of stages $s = 7$

$$
\begin{matrix}
0 \\ \\
\frac{1}{3} & \frac{1}{3} \\ \\
\frac{2}{3} & 0 & \frac{2}{3} \\ \\
\frac{1}{3} & \frac{1}{12} & \frac{1}{3} & -\frac{1}{12} \\ \\
\frac{5}{6} & \frac{25}{48} & -\frac{55}{24} & \frac{35}{48} & \frac{15}{8} \\ \\
\frac{1}{6} & \frac{3}{20} & -\frac{11}{24} & -\frac{1}{8} & \frac{1}{2} & \frac{1}{10} \\ \\
1 & -\frac{261}{260} & \frac{33}{13} & \frac{43}{156} & -\frac{118}{39} & \frac{32}{195} & \frac{80}{39} \\ \\
& \frac{13}{200} & 0 & \frac{11}{40} & \frac{11}{40} & \frac{4}{25} & \frac{4}{25} & \frac{13}{200}
\end{matrix}
$$

Another example is

$$
\begin{matrix}
0 \\ \\
\frac{2}{5} & \frac{2}{5} \\ \\
\frac{4}{5} & 0 & \frac{4}{5} \\ \\
\frac{2}{9} & \frac{169}{1458} & \frac{110}{729} & -\frac{65}{1458} \\ \\
\frac{8}{15} & -\frac{44}{675} & -\frac{88}{135} & \frac{76}{351} & \frac{336}{325} \\ \\
0 & \frac{21}{106} & 0 & -\frac{105}{689} & -\frac{324}{689} & \frac{45}{106} \\ \\
1 & -\frac{2517}{4864} & -\frac{55}{38} & \frac{10615}{31616} & \frac{567}{7904} & \frac{7245}{4864} & \frac{2597}{2432} \\ \\
& 0 & 0 & \frac{1375}{4992} & \frac{6561}{20384} & \frac{3375}{12544} & \frac{53}{768} & \frac{19}{294}
\end{matrix}
$$

## $p = 7$

Methods with order $p = 7$ must have at least nine stages

## $p = 8$

Cooper and Verner method

$$
\begin{matrix}
0 \\ \\
\frac{1}{2} & \frac{1}{2} \\ \\
\frac{1}{2} & \frac{1}{4} & \frac{1}{4} \\ \\
\frac{7 + \sqrt{21}}{14} & \frac{1}{7} & \frac{-7 - 3\sqrt{21}}{98} & \frac{21 + 5\sqrt{21}}{49} \\ \\
\frac{7 + \sqrt{21}}{14} & \frac{11 + \sqrt{21}}{84} & 0 & \frac{18 + 4\sqrt{21}}{63} & \frac{21 - \sqrt{21}}{252} \\ \\
\frac{1}{2} & \frac{5 + \sqrt{21}}{48} & 0 & \frac{9 + \sqrt{21}}{36} & \frac{-231 + 14\sqrt{21}}{360} & \frac{63 - 7\sqrt{21}}{80} \\ \\
\frac{7 - \sqrt{21}}{14} & \frac{10 - \sqrt{21}}{42} & 0 & \frac{-432 + 92\sqrt{21}}{315} & \frac{633 - 145\sqrt{21}}{90} & \frac{-504 + 115\sqrt{21}}{70} & \frac{63 - 13\sqrt{21}}{35} \\ \\
\frac{7 - \sqrt{21}}{14} & \frac{1}{14} & 0 & 0 & 0 & \frac{14 - 3\sqrt{21}}{126} & \frac{13 - 3\sqrt{21}}{63} & \frac{1}{9} \\ \\
\frac{1}{2} & \frac{1}{32} & 0 & 0 & 0 & \frac{91 - 21\sqrt{21}}{576} & \frac{11}{72} & \frac{-385 - 75\sqrt{21}}{1152} & \frac{63 + 13\sqrt{21}}{128} \\ \\
\frac{7 + \sqrt{21}}{14} & \frac{1}{14} & 0 & 0 & 0 & \frac{1}{9} & \frac{-733 - 147\sqrt{21}}{2205} & \frac{515 + 111\sqrt{21}}{504} & \frac{-51 - 11\sqrt{21}}{56} & \frac{132 + 28\sqrt{21}}{245} \\ \\
1 & 0 & 0 & 0 & 0 & \frac{-42 + 7\sqrt{21}}{18} & \frac{-18 + 28\sqrt{21}}{45} & \frac{-273 - 53\sqrt{21}}{72} & \frac{301 + 53\sqrt{21}}{72} & \frac{28 - 28\sqrt{21}}{45} & \frac{49 - 7\sqrt{21}}{18} \\ \\
& \frac{1}{20} & 0 & 0 & 0 & 0 & 0 & 0 & \frac{49}{180} & \frac{16}{45} & \frac{49}{180} & \frac{1}{20}
\end{matrix}
$$
