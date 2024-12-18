## Using Octave

#### Docker

```shell
docker run -it --rm --name octave -v ${PWD}:/working gnuoctave/octave:latest
```

#### Change current directory / Show current directory

```
cd ./octave/dpm
ls
pwd
```

#### Run system command inside Octave

```
system("cat plot_orbit.json")
```
