#include <stdio.h>
#include <iostream>
#include <emscripten.h>

extern "C" {
   void test() {
     EM_ASM(
       console.log("This is a test from WebARKitJS.cpp!")
     );
   }
}

#include "bindings.cpp"
