#!/usr/bin/env python
"""
Sample script that uses the testfuntion module created using
MATLAB Compiler SDK.

Refer to the MATLAB Compiler SDK documentation for more information.
"""

from __future__ import print_function
import testfuntion
import matlab

my_testfuntion = testfuntion.initialize()

xIn = matlab.double([10], size=(1, 1))
testOut = my_testfuntion.testfuntion(xIn)
print(testOut, sep='\n')

my_testfuntion.terminate()
