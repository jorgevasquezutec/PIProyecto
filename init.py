import testfuntion
import matlab

my_testfuntion = testfuntion.initialize()

xIn = matlab.double([10], size=(1, 1))
testOut = my_testfuntion.testfuntion(xIn)
print(testOut)
