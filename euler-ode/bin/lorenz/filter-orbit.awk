#!/usr/bin/env -S awk -f
BEGIN {
    print "t\tx\tz";
}
{
    t = $1;
	split($2, q, ",");
    print t, "\t", q[1], "\t", q[3];
}
