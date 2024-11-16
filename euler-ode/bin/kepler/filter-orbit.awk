#!/usr/bin/env -S awk -f
BEGIN {
	print "t\tx\ty\tdE";
}
NR == 1 {
	E = $5
}
{
	t = $1;
	dE = $5 - E;
	split($2, q, ",");
    print t, "\t", q[1], "\t", q[2], "\t", dE;
}
