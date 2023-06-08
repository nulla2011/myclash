package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	// "path/filepath"
)

const frontpath = "C:/code/yacd/public"

func ReadPac() string {
	// ex, err := os.Executable()
	// if err != nil {
	// 	panic(err)
	// }
	file, err := os.Open("C:/code/whitelist.pac/whitelist.pac")
	if err != nil {
		panic(err)
	}
	defer file.Close()
	var buf [128]byte
	var content []byte
	for {
		n, err := file.Read(buf[:])
		if err == io.EOF {
			break
		}
		content = append(content, buf[:n]...)
	}
	return string(content)
}

var pacFile = ReadPac()

func pac(w http.ResponseWriter, req *http.Request) {
	fmt.Println("pac is requested")
	w.Header().Set("content-type", "application/x-ns-proxy-autoconfig")
	fmt.Fprintf(w, pacFile)
}
func main() {
	go http.ListenAndServe(":9080", http.FileServer(http.Dir(frontpath)))
	http.HandleFunc("/pac", pac)
	http.ListenAndServe(":9081", nil)
}
