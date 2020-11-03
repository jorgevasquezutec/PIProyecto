import countLeucositos
import matlab

my_testfuntion = countLeucositos.initialize()

# testOut = my_testfuntion.countLeucositos('fotos\cells.jpg')
testOut = my_testfuntion.countLeucositos('upload/cells.jpg')
my_testfuntion.terminate()
print(testOut)
