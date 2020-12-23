import method1
import matlab

my_testfuntion = method1.initialize()

# testOut = my_testfuntion.countLeucositos('fotos\cells.jpg')
testOut = my_testfuntion.method1('upload/cells.jpg')
my_testfuntion.terminate()
print(testOut[0])
print(testOut[0][0])
