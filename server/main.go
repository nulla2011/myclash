package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

func ReadPac() string {
	file, err := os.Open("../config/pac")
	if err != nil {
		fmt.Println("err", err)
		os.Exit(1)
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
	w.Header().Set("content-type", "application/x-ns-proxy-autoconfig")
	fmt.Fprintf(w, pacFile)
}
func main() {
	http.HandleFunc("/pac", pac)
	http.ListenAndServe(":9089", nil)
}
