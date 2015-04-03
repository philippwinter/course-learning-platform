public class Clone implements Runnable{
	boolean running=false;
	int id=-1;

	public Clone(int eID){
		running=true;
		id=eID;
	}
	public void run() {
		while(running){
			System.out.println('Hello World from Clone #'+id);
			try {
				Thread.sleep(500);
			} catch (InterruptedException e) {

				e.printStackTrace();
			}
		}

	}

	public void shutdown(){
		running=false;
	}
}