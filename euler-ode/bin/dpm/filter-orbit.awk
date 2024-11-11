#!/usr/bin/env -S awk -f
BEGIN {
	print "t\tq1\tp1\tdE";
}
NR == 1 {
	E = $4
}
{
	t = $1;
	dE = $4 - E;
	split($2, q, ",");
	split($3, p, ",");
    print t, "\t", q[1], "\t", p[1], "\t", dE;
}
